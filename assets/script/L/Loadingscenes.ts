import { _decorator, Component, director, Node } from 'cc';
import { Configs } from '../../utils/Configs';
const { ccclass, property } = _decorator;

@ccclass('Loadingscenes')
export class Loadingscenes extends Component {
    start () {
        director.preloadScene(Configs.GAME_SCENES_PATH, () => {
            
        },
        () => {
            director.loadScene(Configs.GAME_SCENES_PATH);
        }
        )
        
    }
}


