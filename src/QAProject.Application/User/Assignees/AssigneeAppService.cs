using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QAProject.Constants;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace QAProject.User.Assignees;

[Route("api/user")]
[Authorize(Roles = Roles.User)]
public class AssigneeAppService(
    IRepository<IdentityUser, Guid> repository,
    IRepository<IdentityRole, Guid> roleRepository)
    : ReadOnlyAppService<IdentityUser, AssigneeDto, Guid, GetAssigneeDto>(repository),
        IAssigneeAppService
{
    protected override async Task<IQueryable<IdentityUser>> CreateFilteredQueryAsync(GetAssigneeDto input)
    {
        var query = await base.CreateFilteredQueryAsync(input);
        query = query.Where(x => x.Name.ToLower().Contains(input.AssigneeName.ToLower()));

        var assigneeRole = await roleRepository.FirstOrDefaultAsync(r => r.Name == Roles.BA);
        query = assigneeRole != null
            ? query.Where(u => u.Roles.Any(r => r.RoleId == assigneeRole.Id))
            : query.Where(u => false);
        query = query.OrderBy(u => u.Name);
        return query;
    }

    [HttpGet("assignee/{id:guid}")]
    public override Task<AssigneeDto> GetAsync(Guid id) => base.GetAsync(id);

    [HttpGet("assignees")]
    public override Task<PagedResultDto<AssigneeDto>> GetListAsync(GetAssigneeDto input) => base.GetListAsync(input);
}