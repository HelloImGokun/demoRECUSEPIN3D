import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
    private nextButtonCallback;
    setUp(nextButtonCallback){
        this.nextButtonCallback = nextButtonCallback;
    }
    onNextLevel(){
        this.node.destroy();
        //
        if(this.nextButtonCallback){
            this.nextButtonCallback();
        }
    }
}


