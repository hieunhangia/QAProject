using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace QAProject.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class QAProjectDbContextFactory : IDesignTimeDbContextFactory<QAProjectDbContext>
{
    public QAProjectDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        QAProjectEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<QAProjectDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));
        
        return new QAProjectDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../QAProject.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }
}
