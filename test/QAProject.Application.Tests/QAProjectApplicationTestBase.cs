using Volo.Abp.Modularity;

namespace QAProject;

public abstract class QAProjectApplicationTestBase<TStartupModule> : QAProjectTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
