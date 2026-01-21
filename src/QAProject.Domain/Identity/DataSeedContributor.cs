using System.Threading.Tasks;
using QAProject.Constants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace QAProject.Identity;

public class DataSeedContributor(
    IdentityRoleManager roleManager,
    IdentityUserManager userManager,
    IGuidGenerator guidGenerator)
    : IDataSeedContributor, ITransientDependency
{
    public async Task SeedAsync(DataSeedContext context)
    {
        var roles = new[] { Roles.Admin, Roles.BA, Roles.User };
        foreach (var role in roles)
        {
            if (await roleManager.FindByNameAsync(role) != null) continue;
            var identityRole = new IdentityRole(
                guidGenerator.Create(),
                role,
                context.TenantId
            )
            {
                IsStatic = true,
                IsPublic = true
            };
            await roleManager.CreateAsync(identityRole);
        }
        
        const string adminUserName = "myadmin";
        const string adminEmail = "myadmin@app.com";
        if (await userManager.FindByNameAsync(adminUserName) == null)
        {
            var user = new IdentityUser(
                guidGenerator.Create(),
                adminUserName,
                adminEmail,
                context.TenantId
            );
            var result = await userManager.CreateAsync(user, "MyAdmin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(user, [Roles.Admin, Roles.BA, Roles.User]);
            }
        }
        
        const string managerUserName = "ba";
        const string managerEmail = "ba@app.com";
        if (await userManager.FindByNameAsync(managerUserName) == null)
        {
            var user = new IdentityUser(
                guidGenerator.Create(),
                managerUserName,
                managerEmail,
                context.TenantId
            );
            var result = await userManager.CreateAsync(user, "Ba@123");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(user, [Roles.BA, Roles.User]);
            }
        }

        for (var i = 1; i <= 5; i++)
        {
            var userName = $"user{i}";
            var email = $"user{i}@app.com";
            if (await userManager.FindByNameAsync(userName) != null) continue;
            var user = new IdentityUser(
                guidGenerator.Create(),
                userName,
                email,
                context.TenantId
            );
            var result = await userManager.CreateAsync(user, "User@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Roles.User);
            }
        }
    }
}