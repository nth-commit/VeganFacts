﻿using Microsoft.CSharp.RuntimeBinder;
using Nulobe.Api.Core.Facts;
using Nulobe.DocumentDb.Client;
using Nulobe.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nulobe.Api.Core.Sources.SourceValidationHandlers
{
    public class NulobeSourceValidationHandler : ISourceValidationHandler
    {
        private readonly IDocumentClientFactory _documentClientFactory;

        public NulobeSourceValidationHandler(
            IDocumentClientFactory documentClientFactory)
        {
            _documentClientFactory = documentClientFactory;
        }

        public SourceType Type => SourceType.Nulobe;

        public async Task<SourceValidationResult> IsValidAsync(dynamic source)
        {
            string factId = source.factId;
            if (string.IsNullOrEmpty(factId))
            {
                return SourceValidationResult.Invalid("FactId", "FactId is required");
            }

            FactData fact = null;
            using (var client = _documentClientFactory.Create(readOnly: true))
            {
                try
                {
                    fact = await client.ReadFactDocumentAsync<FactData>(factId);
                }
                catch (DocumentNotFoundException)
                {
                    return SourceValidationResult.Invalid("FactId", $"No fact with Id {factId} exists");
                }
            }

            source.factTitle = fact.Title;

            return SourceValidationResult.Valid();
        }
    }
}
