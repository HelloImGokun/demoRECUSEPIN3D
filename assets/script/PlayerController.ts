import { _decorator, EventTarget, Node,  Vec3, tween,ITriggerEvent,  Tween} from 'cc';
import { Configs } from '../utils/Configs';
import { LevelController } from './controller/LevelController';
import { PointNode } from './P/PointNode';
import { ResouceUtils } from '../utils/ResouceUtils';
import { Person } from './P/Person';
import { Door } from './D/Door';
import { PathList } from './P/PathList';
import { PointType } from './Enum/PointType';
const { ccclass, property } = _decorator;
export const eventTarget = new EventTarget();
@ccclass('PlayerController')
export class PlayerController extends Person {
   

    //check door
    private isFindDoor: boolean = false;
    private levelController: LevelController;
    //check xem player da die or win
    private isOver: boolean = false;
    //duong di duoc lua chon
    private selectedPath:PathList = null
    //index cua duong di
    private pointCount:number = 0;
    //check xem player co dang tim duong hay khong
    private isFindingPath:boolean=false;
    protected onLoad(): void {
        eventTarget.on('onListingAnimal', (data) => {
           //lang nghe su kien boar die  // print 1, 2, 3
           console.log('boar die tiep tuc find path')
           this.findPath();
        });
    }
    start() {
        //
        console.log('start',this.collider);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.on('onTriggerExit', this.onTriggerExit, this);
        //get LevelController
        this.levelController = this.node.parent?.getComponent(LevelController);
        this.findPath();
    }

    //
    //FindPath
    public findPath() {
        //lap qua path list de tim duong
        console.log('findPath',this.isFindingPath);
        //
        if (this.isOver) return;
        //neu dang tim duong roi thi khong check tiep
        if(this.isFindingPath) return;
        //neu dang tim duong roi thi check tiep
        this.isFindingPath = true;
        //

        //
        //
        let pathList = this.levelController.getPathList();
               //loop qua toan bo cac duong di
               for (let i = 0; i < pathList.length; i++) {
                //lay ra 1 duong di va check xem co the di duoc hay khong
                let pList: PathList = pathList[i];
                if (pList && this.isPointUnlock(pList)) {
                    console.log('Path ', i, ' clear!');
                    this.selectedPath = pList;
                    return this.followPath();
                }else{
                    console.log('Path ', i, ' not clear!');
                    this.isFindingPath=false;
                }
            }

    }

    private isPointUnlock(pointList: PathList) {
        //check 1st point of path
        if (!pointList.getPointList()[0].getIsLock()) {
            return true;
        }
        return false;
    }
    private followPath() {
        //check path 0
        console.log();
        this.checkPoint();
    }
    private checkPoint() {
        console.log('checkpoint', this.pointCount);
        this.checkPointAndMove(this.selectedPath.getPointList()[this.pointCount]);
    }
    // z luon bang 0
    private convertPositionToPlayerY(playerPos, pointPos) {
        return new Vec3(pointPos.x, playerPos.y, 0);
    }
    //
    private checkPointAndMove(pointNode: PointNode) {
        if (pointNode == null) {
            //end of way
            console.log('End of way...');
            //khi khong tim duoc duong thi set lai
            this.isFindingPath =false
            //reset lai point
            this.pointCount = 0;
            return;
        }
        //point dang lock
        if(pointNode.getIsLock()){
            console.log('Point is locked...');
            this.isFindingPath =false
            return;
        };
        if(this.isOver) return;
        //
        let pointType = pointNode.getPointType();
        switch (pointNode.getPointType()) {
            case PointType.walk:
                this.moveToPoint(pointNode, () => {
                    console.log('moved');
                    this.pointCount++;
                    this.checkPoint();
                });
                break;
            case PointType.jump:
                this.jumpToPoint(pointNode, () => {
                    this.pointCount++;
                    this.checkPoint();
                })
                break;
                case PointType.fall:
                    this.scheduleOnce(() => {
                        //cho cho den khi roi xuong dat
                        this.pointCount++;
                        this.checkPoint();
                    },pointNode.getMovingTime());
                    break;

            case PointType.swimL:
                break;
        }
    }
    private moveToPoint(pointNode: PointNode, finishCallback) {
        //tween
        tween(this.node).sequence(
            tween(this.node).to(pointNode.getMovingTime(), { position: pointNode.node.position }),
            tween(this.node).delay(pointNode.getDelayTime()),
            tween(this.node).call(finishCallback)
        ).start();
        //
        //this.node.translate( pointNode.node.position);
        //

    }
    private jumpToPoint(point:PointNode, finishCallback) {

        //add force
        this.rigidBody.applyForce(point.getJumpForce());
        this.scheduleOnce(finishCallback, point.getMovingTime());
    }
    //
    //check touch door
    private onTriggerEnter(event: ITriggerEvent) {
        //
        console.log('onTriggerEnter', event);

        if (this.isOver) return;
        //
        let collisionNode: Node = event.otherCollider.node;
        console.log('collider', collisionNode.name);
        //check player dat chan xuong mat dat hay chua
        if (collisionNode.name.includes(Configs.FLOOR_GROUND_NAME) || collisionNode.name.includes(Configs.DOOR_NAME)) {
            //player roi xuong mat dat
            this.animationController.setValue('landed', true);
        }
        if (!this.isFindDoor) {
            //1. check door
            if (collisionNode.name.includes(Configs.DOOR_NAME)) {
                this.findDoor(collisionNode);
            }
            //cham vao enemy la die
            else if (collisionNode.name.includes(Configs.KILL_PLAYER_OBJ) || collisionNode.name.includes(Configs.KILL_ALL_OBJ)) {
                this.animationController.setValue('isDie', true);
                this.isOver = true;
                //stop all tween
                //
                Tween.stopAllByTarget(this.node);
                //
                //delay for a second
                this.scheduleOnce(() => {
                    //lose game
                    let LevelControllerNode = this.node.getParent();
                    if (LevelControllerNode.getComponent(LevelController)) {
                        LevelControllerNode.getComponent(LevelController).loseGame();
                    }
                }, 1)
            }
        }
        //bring float
        if(collisionNode.name.includes('float')){
           let bringfloat = Configs.FLOAT_PREFAB_PATH
            ResouceUtils.preloadPrefab(bringfloat);
            console.log('hi bring float')
        }
        //
    }

    private onTriggerExit(event: ITriggerEvent) {
        //check xem player da thoat khoi mat dat chua
        //
        if (this.isOver) return;
        if (event.otherCollider.name.includes(Configs.FLOOR_GROUND_NAME)) {
            //player roi tu do
            this.animationController.setValue('onair', true);
        }
    }
   
    //
    private findDoor(doorNode:Node) {
        if (this.isFindDoor) return;
        this.isFindDoor = true;
        //
        const simpleDoor = ()=>{
            //
            tween(this.node).sequence(
                //xoay nguoi lai huong door
                tween(this.node).delay(0.5),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),
                tween(this.node).by(0.5, { position: new Vec3(0, 0, -0.4) }),
                tween(this.node).call(() => {
                    //open door
                    doorNode.getComponent(Door).openDoor();
                }),
                tween(this.node).delay(0.5),
                //xoay nguoi huong ra ngoai 
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 0, 0) }),
                tween(this.node).call(() => {
                    //do win animation;
                    this.animationController.setValue('win', true);
    
                    // setTimeout(() => {
                    //     this.animationController.setValue('win',false);
                    // }, 1000);
                }),
                tween(this.node).delay(1),
                tween(this.node).call(() => {
                    this.openDoorSuccess();
                })
            ).start();
            //
           
        }
        const npcDoor = () =>{
            //npc point 
            let standPoint = doorNode.getComponent(Door).getStandPoint();
            tween(this.node).sequence(
                //xoay nguoi lai huong door
                tween(this.node).delay(0.5),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, 180, 0) }),
                tween(this.node).by(0.5, { position: new Vec3(0, 0, -0.4) }),
                tween(this.node).call(() => {
                    //open door
                    doorNode.getComponent(Door).openDoor();
                }),
                tween(this.node).delay(0.5),
                //nhay vao ben trong va xoay doi dien voi npc
                tween(this.node).to(0.2, { position: standPoint }),
                tween(this.node).to(0.2, { eulerAngles: new Vec3(0, -90, 0) }),
                tween(this.node).call(() => {
                    //do win animation;
                    this.animationController.setValue('win', true);
    
                    // setTimeout(() => {
                    //     this.animationController.setValue('win',false);
                    // }, 1000);
                }),
                tween(this.node).delay(1),
                tween(this.node).call(() => {
                    this.openDoorSuccess();
                })
                
                
            ).start();
        }
         
        //
        //door npc
        if(doorNode.getComponent(Door).getIsNPC()){
            //npc
            npcDoor();
        }else{
            //door thuong
            simpleDoor();
        }

       


    }
    private openDoorSuccess() {
        //win
        //get level manager
        let LevelControllerNode = this.node.getParent();
        if (LevelControllerNode.getComponent(LevelController)) {
            LevelControllerNode.getComponent(LevelController).winLevel();
        }

    }

    //
    update(deltaTime: number) {
        //check run
        this.checkRun();

        //
    }


    private checkRun() {
        if (this.oldX == null) {
            this.oldX = this.node.position.x;
        } else {
            this.newX = this.node.position.x;
            let deltaX = this.newX - this.oldX
            //check left or right
            this.checkMoveLeftOrRight(deltaX);
            this.animationController.setValue('dx', Math.abs(deltaX));
            //console.log('dx',deltaX);
            this.oldX = this.newX;
        }
        //check z


        if (this.oldZ == null) {
            this.oldZ = this.node.position.z;
        } else {
            this.newZ = this.node.position.z;
            let deltaZ = this.newZ - this.oldZ
            //check left or right
            this.animationController.setValue('dz', Math.abs(deltaZ));
            //console.log('dx',deltaX);
            this.oldZ = this.newZ;
        }


    }
    private checkMoveLeftOrRight(deltaX) {

        if (deltaX > 0.001) {
            //move right
            console.log('move right');
            this.node.setRotationFromEuler(new Vec3(0, 90, 0));
        } else if (deltaX < -0.001) {
            console.log('move left');
            //move left
            this.node.setRotationFromEuler(new Vec3(0, -90, 0));
        }
    }
    //

}


