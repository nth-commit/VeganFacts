﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nulobe.DocumentDb.Client;

namespace Nulobe.Api.Services
{
    public class FactServiceOptions : IDocumentDbConnectionSpec, IDocumentDbCollectionSpec
    {
        public Uri ServiceEndpoint { get; set; }
        public string AuthorizationKey { get; set; }
        public string CollectionName { get; set; }
        public string DatabaseName { get; set; }
    }
}