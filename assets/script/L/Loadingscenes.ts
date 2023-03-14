import { _decorator, Component, director, Node } from 'cc';
import { Configs } from '../../utils/Configs';
import { ResouceUtils } from '../../utils/ResouceUtils';
const { ccclass, property } = _decorator;

@ccclass('Loadingscenes')
export class Loadingscenes extends Component {
    start() {
        director.preloadScene(Configs.GAME_SCENES_PATH, () => {
            ResouceUtils.loadPrefab(Configs.LOAD_LEVEL_PATH + 1, (lvPrefab) => {
            })
        },
            () => {
                director.loadScene(Configs.GAME_SCENES_PATH);
            }
        )

    }
}


