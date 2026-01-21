using Volo.Abp.Modularity;

namespace QAProject;

[DependsOn(
    typeof(QAProjectApplicationModule),
    typeof(QAProjectDomainTestModule)
)]
public class QAProjectApplicationTestModule : AbpModule
{

}
