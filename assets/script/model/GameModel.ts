import { _decorator, Component, Node, Prefab, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
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


