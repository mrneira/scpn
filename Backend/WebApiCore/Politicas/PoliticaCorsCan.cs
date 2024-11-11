using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace WebApiCore.Politicas {
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    
    public class PoliticaCorsCan : Attribute, ICorsPolicyProvider {
        private CorsPolicy policy;
        public PoliticaCorsCan() {
            policy = new CorsPolicy { };
            policy.AllowAnyOrigin = true;
            policy.Headers.Add("x-auth-token");
            policy.Headers.Add("X-Requested-With");
            policy.Headers.Add("Content-Type");
            policy.Headers.Add("Accept");
            policy.Headers.Add("Cache-Control");

            policy.Methods.Add("POST");
            policy.Methods.Add("OPTIONS");
            policy.SupportsCredentials = true;
        }

        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken) {
            return Task.FromResult(policy);
        }
    }
}