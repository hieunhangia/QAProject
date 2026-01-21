using QAProject.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace QAProject.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(QAProjectEntityFrameworkCoreModule),
    typeof(QAProjectApplicationContractsModule)
)]
public class QAProjectDbMigratorModule : AbpModule
{
}
