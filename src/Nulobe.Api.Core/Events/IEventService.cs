﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nulobe.Api.Core.Events
{
    public interface IEventService<TEventCreate> where TEventCreate : IEventCreate
    {
        Task<Event> CreateEventAsync(TEventCreate create);
    }
}
