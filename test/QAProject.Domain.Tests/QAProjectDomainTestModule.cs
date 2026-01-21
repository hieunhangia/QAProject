using Volo.Abp.Modularity;

namespace QAProject;

[DependsOn(
    typeof(QAProjectDomainModule),
    typeof(QAProjectTestBaseModule)
)]
public class QAProjectDomainTestModule : AbpModule
{

}
