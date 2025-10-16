package Practice06;

class Cannon extends Weapon {
    @Override
    protected int fire() { // 오버라이딩
        return 10; // 대포는한번에10명을살상
    }
}

public class Practice06 {
    public static void main(String[] args) {
        Weapon weapon;
        weapon = new Weapon();
        System.out.println("기본무기의살상능력은" + weapon.fire());
        weapon = new Cannon();
        System.out.println("대포의살상능력은" + weapon.fire());
    }
}