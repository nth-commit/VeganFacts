﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Nulobe.Framework
{
    public interface IRemoteIpAddressAccessor
    {
        string RemoteIpAddress { get; }
    }
}
