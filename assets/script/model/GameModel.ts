import { _decorator, Component, Node, Prefab, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    //
    COMPLETED_COMMENT: string[] = ['Great!', 'Epic!', 'Fantasic!', 'Impressive!', 'Fabulous!', 'Beautiful!', 'Wonderful!', 'Awesome!', 'Incredible!', 'Phenomenal!', 'Brilliant!'];
    //
    @property(Node)
    gameCanvas: Node|null = null;
    @property(Node)
    public gamePlayNode:Node;
    @property(Node)
    public canvasUI:Node;
    @property(Label)
    public lbGameLevel:Label;

    @property(Prefab)
    public winUIPrefab:Prefab;
    @property(Prefab)
    public loseUIPrefabs:Prefab;
    start() {

    }
}


