using QAProject.Localization;
using Volo.Abp.Application.Services;

namespace QAProject;

/* Inherit your application services from this class.
 */
public abstract class QAProjectAppService : ApplicationService
{
    protected QAProjectAppService()
    {
        LocalizationResource = typeof(QAProjectResource);
    }
}
