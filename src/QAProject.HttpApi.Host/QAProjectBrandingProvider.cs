using Microsoft.Extensions.Localization;
using QAProject.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace QAProject;

[Dependency(ReplaceServices = true)]
public class QAProjectBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<QAProjectResource> _localizer;

    public QAProjectBrandingProvider(IStringLocalizer<QAProjectResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
