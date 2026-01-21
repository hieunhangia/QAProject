using Volo.Abp.Settings;

namespace QAProject.Settings;

public class QAProjectSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(QAProjectSettings.MySetting1));
    }
}
