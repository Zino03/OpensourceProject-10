import java.util.Random;
import java.util.Scanner;

abstract class Player {
    protected String bet[] = {"묵", "찌", "빠"};
    protected String name;
    protected String lastBet = null;

    protected Player(String name) {this.name = name;}
    public String getName() {return name;}
    public String getBet() {return lastBet;}
    abstract public String next();
}

class Human extends Player {
    private Scanner scanner = new Scanner(System.in);
    public Human(String name) {super(name);}
    @Override
    public String next() {
        int check = 1;
        for(;;) {
            System.out.print(this.getName()+">>");
            lastBet = scanner.next();
            for (int i = 0; i < bet.length; i++) {
                if (bet[i].equals(lastBet)) {
                    check = 0;
                }
            }
            if (check == 1) {
                System.out.println("다시입력해주세요");
            } else {
                break;
            }
        }
        return lastBet;
    }
}

class Computer extends Player {
    public Computer(String name) {super(name);}
    @Override
    public String next() {
        System.out.println(this.getName()+">> 결정하였습니다.");
        Random random = new Random(System.currentTimeMillis());
        int randomNum = random.nextInt(3);
        lastBet = bet[randomNum];
        return lastBet;
    }
}

class Game {
    private Player [] players = new Player[2];
    private Scanner scanner = new Scanner(System.in);
    public Game() {}
    private void createPlayer() {
        System.out.println("***** 묵찌빠 게임을 시작합니다. *****");
        System.out.print("선수이름 입력>>");
        String humanName = scanner.next();
        players[0] = new Human(humanName);
        System.out.print("컴퓨터이름 입력>>");
        String computerName = scanner.next();
        players[1] = new Computer(computerName);
        System.out.println("2명의 선수를 생성 완료하였습니다...");
        System.out.println();
    }
    public void run() {
        createPlayer();

        int owner = 0;
        int notOwner = 1;

        while(true) {
            players[owner].next();
            players[notOwner].next();
            System.out.print(players[owner].getName()+" : "+players[owner].getBet()+", ");
            System.out.println(players[notOwner].getName()+" : "+players[notOwner].getBet());

            String ownerBet = players[owner].getBet();
            String notOwnerBet = players[notOwner].getBet();

            if(ownerBet.equals(notOwnerBet)) {
                break;
            }

            if((ownerBet.equals("묵")&&notOwnerBet.equals("빠"))||(ownerBet.equals("찌")&&notOwnerBet.equals("묵"))||(ownerBet.equals("빠")&&notOwnerBet.equals("찌"))) {
                int tmp = owner;
                owner = notOwner;
                notOwner = tmp;
                System.out.println("오너가 "+players[owner].getName()+"로 변경되었습니다.");
            }

            System.out.println();
        }

        System.out.println();
        System.out.println(players[owner].getName()+"이 이겼습니다.");
        System.out.println("게임을 종료합니다...");
    }
}

public class Practice10 { // MGPapp
    public static void main(String[] args) {
        new Game().run();
    }
}
