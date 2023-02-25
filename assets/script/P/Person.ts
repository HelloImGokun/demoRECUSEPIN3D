import { _decorator, animation, Collider, Component,  RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Person')
export class Person extends Component {
    protected oldX:number = null;
    protected newX:number = null;
    protected oldZ:number = null;
    protected newZ:number = null;
    //
    @property(animation.AnimationController)
    protected animationController: animation.AnimationController;
    @property(RigidBody)
    protected rigidBody: RigidBody;
    //khai bao trong start
    @property(Collider)
    protected collider:Collider;
    //
    //
     protected start(): void {


     }
    protected update(dt: number){
        
    }
    protected Move() {
   
    }
   protected Jump() {
       
   }
   protected Swim() {
       
   }
   protected Attack() {
       
   }
   protected Die() {
       
   }
   protected Win() {
       
   }
   protected Lose() {
       
   }
   
}


