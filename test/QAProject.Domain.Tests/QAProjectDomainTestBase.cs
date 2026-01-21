using Volo.Abp.Modularity;

namespace QAProject;

/* Inherit from this class for your domain layer tests. */
public abstract class QAProjectDomainTestBase<TStartupModule> : QAProjectTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
