using System.Threading.Tasks;

namespace QAProject.Data;

public interface IQAProjectDbSchemaMigrator
{
    Task MigrateAsync();
}
