using QAProject.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace QAProject.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class QAProjectController : AbpControllerBase
{
    protected QAProjectController()
    {
        LocalizationResource = typeof(QAProjectResource);
    }
}
