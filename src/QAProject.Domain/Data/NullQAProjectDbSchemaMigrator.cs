using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace QAProject.Data;

/* This is used if database provider does't define
 * IQAProjectDbSchemaMigrator implementation.
 */
public class NullQAProjectDbSchemaMigrator : IQAProjectDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
