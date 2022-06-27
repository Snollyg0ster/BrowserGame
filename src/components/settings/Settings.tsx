import { useState } from "react";
import { SettingsProps } from "../../models";

interface Props {
  settings: SettingsProps | undefined;
}

const Settings = (props: Props) => {
  const { settings } = props;
  const [godMode, setGodMode] = useState(false);

  const godModeHandle = () => {
    settings?.setInvincible(!godMode)
    setGodMode(!godMode)
  }

  return (<div>
    <table>
      <tbody>
        <tr onClick={godModeHandle}>
          <td><input type="checkbox" checked={godMode} /></td>
          <td ><label>God Mode</label></td>
        </tr>
      </tbody>
    </table>
  </div>);
};

export default Settings;