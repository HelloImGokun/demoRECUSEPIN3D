import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Bullet } from '../B/Bullet';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends Component {
    @property(Prefab)
    bulletPrefab: Prefab | null = null;
    @property
    direction: number = 1;
    start() {
        // [3]
        setInterval(() => {
            this.fire();
        }, 9000);
        setTimeout(() => {
            this.fire();
        }, 3000);
    }
    fire() {
        if (this.bulletPrefab) {
            let bulletfire = instantiate(this.bulletPrefab);
            bulletfire.getComponent(Bullet).setUp(this.direction);
            this.node.addChild(bulletfire);
        }


}

}
