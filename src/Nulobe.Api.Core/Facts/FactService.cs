﻿using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nulobe.DocumentDb.Client;
using AutoMapper;
using Nulobe.Framework;
using Nulobe.Utility.Validation;
using System.Text.RegularExpressions;
using Nulobe.System.Collections.Generic;
using Nulobe.Utility.SlugBuilder;

namespace Nulobe.Api.Core.Facts
{
    public class FactService : IFactService
    {
        private static readonly Regex SourceReferenceRegex = new Regex(@"\[(\d+)\]");

        private readonly FactServiceOptions _factServiceOptions;
        private readonly DocumentDbOptions _documentDbOptions;
        private readonly IClaimsPrincipalAccessor _claimsPrincipalAccessor;
        private readonly Auditor _auditor;
        private readonly IDocumentClientFactory _documentClientFactory;
        private readonly IMapper _mapper;

        public FactService(
            IOptions<FactServiceOptions> factServiceOptions,
            IOptions<DocumentDbOptions> documentDbOptions,
            IClaimsPrincipalAccessor claimsPrincipalAccessor,
            Auditor auditor,
            IDocumentClientFactory documentClientFactory,
            IMapper mapper)
        {
            _factServiceOptions = factServiceOptions.Value;
            _documentDbOptions = documentDbOptions.Value;
            _claimsPrincipalAccessor = claimsPrincipalAccessor;
            _auditor = auditor;
            _documentClientFactory = documentClientFactory;
            _mapper = mapper;
        }

        public async Task<Fact> GetFactAsync(string id)
        {
            using (var client = _documentClientFactory.Create(_documentDbOptions))
            {
                try
                {
                    return await client.ReadDocumentAsync<Fact>(_documentDbOptions, _factServiceOptions.FactCollectionName, id);
                }
                catch (DocumentNotFoundException ex)
                {
                    throw new ClientEntityNotFoundException(typeof(Fact), id, ex);
                }
            }
        }

        public async Task<Fact> CreateFactAsync(Fact fact)
        {
            AssertAuthenticated();
            Validator.ValidateNotNull(fact, nameof(fact));
            ValidateFact(fact);

            var factAudit = new FactAudit() { CurrentValue = fact };
            _auditor.AuditAction(nameof(CreateFactAsync), factAudit);
            
            fact.Slug = GenerateSlug(fact);
            fact.SlugHistory = new SlugAudit[]
            {
                new SlugAudit()
                {
                    Slug = fact.Slug,
                    Created = factAudit.Actioned
                }
            };

            fact.Id = Guid.NewGuid().ToString();
            using (var client = _documentClientFactory.Create(_documentDbOptions))
            {
                await client.CreateDocumentAsync(_documentDbOptions, _factServiceOptions.FactCollectionName, fact);
                await client.CreateDocumentAsync(_documentDbOptions, _factServiceOptions.FactAuditCollectionName, factAudit);
            }
            return fact;
        }

        public async Task DeleteFactAsync(string id)
        {
            AssertAuthenticated();
            Validator.ValidateStringNotNullOrEmpty(id, nameof(id));

            using (var client = _documentClientFactory.Create(_documentDbOptions))
            {
                var fact = await client.ReadDocumentAsync<Fact>(_documentDbOptions, _factServiceOptions.FactCollectionName, id);
                if (fact == null)
                {
                    throw new ClientEntityNotFoundException(typeof(Fact), id);
                }

                var factAudit = new FactAudit() { PreviousValue = fact };
                _auditor.AuditAction(nameof(DeleteFactAsync), factAudit);

                await client.CreateDocumentAsync(_documentDbOptions, _factServiceOptions.FactAuditCollectionName, factAudit);
                await client.DeleteDocumentAsync(_documentDbOptions, _factServiceOptions.FactCollectionName, id);
            }
        }

        public async Task<Fact> UpdateFactAsync(string id, Fact fact)
        {
            AssertAuthenticated();
            Validator.ValidateNotNull(fact, nameof(fact));
            ValidateFact(fact);

            fact.Id = id;

            using (var client = _documentClientFactory.Create(_documentDbOptions))
            {
                var existingFact = await client.ReadDocumentAsync<Fact>(_documentDbOptions, _factServiceOptions.FactCollectionName, id);
                if (existingFact == null)
                {
                    throw new ClientEntityNotFoundException(typeof(Fact), id);
                }

                var factAudit = new FactAudit() {
                    CurrentValue = fact,
                    PreviousValue = existingFact
                };
                _auditor.AuditAction(nameof(UpdateFactAsync), factAudit);

                if (fact.Title == existingFact.Title)
                {
                    fact.Slug = existingFact.Slug;
                    fact.SlugHistory = existingFact.SlugHistory;
                }
                else
                {
                    fact.Slug = GenerateSlug(fact);
                    fact.SlugHistory = Enumerable.Empty<SlugAudit>()
                        .Concat(existingFact.SlugHistory)
                        .Concat(new SlugAudit[]
                        {
                            new SlugAudit()
                            {
                                Slug = fact.Slug,
                                Created = factAudit.Actioned
                            }
                        });
                }

                await client.CreateDocumentAsync(_documentDbOptions, _factServiceOptions.FactAuditCollectionName, factAudit);
                await client.ReplaceDocumentAsync(_documentDbOptions, _factServiceOptions.FactCollectionName, id, fact);
            }

            return fact;
        }


        #region Helpers

        private void AssertAuthenticated()
        {
            if (!_claimsPrincipalAccessor.ClaimsPrincipal.Identity.IsAuthenticated)
            {
                throw new ClientUnauthenticatedException();
            }
        }

        private void ValidateFact(Fact fact)
        {
            var (isValid, modelErrors) = Validator.IsValid(fact);

            if (modelErrors.IsMemberValid(nameof(FactCreate.Definition)))
            {
                var indexSequence = SourceReferenceRegex.Matches(fact.Definition)
                    .Cast<Match>()
                    .Select(m =>
                    {
                        var groups = m.Groups.Cast<Group>();
                        var group = groups.Skip(1).First();

                        int.TryParse(group.Value, out int index);
                        return index;
                    })
                    .Where(i => i >= 1 && i <= _factServiceOptions.MaxSourceCount);

                if (indexSequence.Any())
                {
                    if (indexSequence.Max() != fact.Sources.Count())
                    {
                        modelErrors.Add(
                            $"Expected number of sources ({fact.Sources.Count()}) to equal the number referenced in {nameof(FactCreate.Definition)} ({indexSequence.Max()})",
                            nameof(FactCreate.Definition));
                    }

                    var expectedIndexSequence = ListHelpers.Range(1, indexSequence.Max());
                    if (!expectedIndexSequence.SequenceEqual(indexSequence))
                    {
                        modelErrors.Add(
                            $"Source references in {nameof(FactCreate.Definition)} should be ascending and without missing indicies. Index sequence was [{string.Join(", ", indexSequence)}]",
                            nameof(FactCreate.Definition));
                    }
                }
            }

            var sources = fact.Sources.ToList();
            for (var i = 0; i < sources.Count(); i++)
            {
                var (isSourceValid, sourceModelErrors) = Validator.IsValid(sources[i]);
                if (!isSourceValid)
                {
                    modelErrors.Add(sourceModelErrors, $"{nameof(fact.Sources)}[{i}]");
                }
            }

            if (modelErrors.Errors.Count() > 0)
            {
                throw new ClientModelValidationException(modelErrors);
            }
        }

        private string GenerateSlug(Fact fact)
        {
            var slugBuilder = new SlugBuilderFactory().Create();
            slugBuilder.Add(new Random().Next(10000, 99999));
            slugBuilder.Add(fact.Title);
            return slugBuilder.ToString();
        }

        #endregion

    }
}
