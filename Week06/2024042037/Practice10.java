import java.util.Scanner;
import java.util.Random;

abstract class Player {
    protected String bet[] = {"묵", "찌", "빠"};
    protected String name;
    protected String lastBet = null;

    protected Player (String name) {
        this.name = name;
    }
    public String getName () {
        return name;
    }
    public String getBet () {
        return lastBet;
    }
    abstract public String next();
}

class Human extends Player {
    private Scanner scanner = new Scanner(System.in);
    public Human(String name) {
        super(name);
    }
    @Override
    public String next() {
        System.out.print(name + ">>");
        return scanner.next();
    }
}

class Computer extends Player {
    public Computer(String name) {
        super(name);
    }
    @Override
    public String next() {
        System.out.println(name + ">> 결정하였습니다.");
        return bet[new Random().nextInt(3)];
    }
}

class Game {
    private Player [] players = new Player[2];
    private Scanner scanner = new Scanner(System.in);
    private void createPlayer() {
        System.out.print("선수이름 입력>>");
        players[0] = new Human(scanner.next());

        System.out.print("컴퓨터이름 입력>>");
        players[1] = new Computer(scanner.next());

        System.out.println("2명의 선수를 생성 완료하였습니다...");
    }
    public void run() {
        System.out.println("***** 묵찌빠 게임을 시작합니다. *****");
        createPlayer();

        while (true) {
            System.out.println();

            String p1 = players[0].next();
            String p2 = players[1].next();

            System.out.print(players[0].name + " : " + p1 + ", ");
            System.out.println(players[1].name + " : " + p2);

            if (p1.equals(p2)) {
                String lastP1 = players[0].getBet();
                String lastP2 = players[1].getBet();

                System.out.println();
                if ((lastP1.equals("묵") && lastP2.equals("찌"))
                    || (lastP1.equals("찌") && lastP2.equals("빠"))
                    || (lastP1.equals("빠") && lastP2.equals("묵"))) {
                    System.out.println(players[0].name + "이/가 이겼습니다.");
                } else if ((lastP2.equals("묵") && lastP1.equals("찌"))
                        || (lastP2.equals("찌") && lastP1.equals("빠"))
                        || (lastP2.equals("빠") && lastP1.equals("묵"))){
                    System.out.println(players[1].name + "이/가 이겼습니다.");
                }

                break;
            }

            players[0].lastBet = p1;
            players[1].lastBet = p2;
        }

        System.out.println("게임을 종료합니다...");
    }
}

public class Practice10 {   // classMGPApp
    public static void main(String[] args) {
        new Game().run();
    }
}
