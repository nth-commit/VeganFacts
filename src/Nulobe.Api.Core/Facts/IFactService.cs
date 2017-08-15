﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nulobe.Api.Core.Facts
{
    public interface IFactService
    {
        Task<Fact> GetFactAsync(string id);

        Task<Fact> CreateFactAsync(Fact fact);

        Task<Fact> UpdateFactAsync(string id, Fact fact);

        Task DeleteFactAsync(string id);
    }
}
