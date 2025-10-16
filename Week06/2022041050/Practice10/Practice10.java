package Practice10;

import java.util.Scanner;
import java.util.Random;

abstract class Player {
    protected String bet[] = { "묵", "찌", "빠" };
    protected String name;
    protected String lastBet = null;

    protected Player(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getBet() {
        return lastBet;
    }

    abstract public String next();

}

// 사람선수를표현하는클래스. Player 클래스를상속받아next() 구현
class Human extends Player {
    private Scanner scanner = new Scanner(System.in);

    public Human(String name) {
        super(name);
    }

    // 추상메소드구현
    @Override
    public String next() {
        System.out.print(name + ">> ");
        String now = scanner.nextLine();
        lastBet = now;
        return now;
    }
}

// 컴퓨터선수를표현하는클래스. Player 클래스를상속받아next() 구현
class Computer extends Player {

    public Computer(String name) {
        super(name);
    }

    @Override
    public String next() { // bet에서랜덤하게한개선택하여리턴
        Random random = new Random();
        String now = bet[random.nextInt(3)];
        System.out.println(name + ">> 결정하였습니다.");
        lastBet = now;
        return now;
    }
}

class Game {
    private Player[] players = new Player[2]; // 두명의선수객체
    private Scanner scanner = new Scanner(System.in);
    private Player winnerPlayer = null;
    private Player losePlayer = null;

    public Game() {
    }

    private void createPlayer() { // 2명의선수객체생성

        System.out.print("선수 이름 입력 >> ");
        String human_name = scanner.nextLine();
        System.out.print("컴퓨터 이름 입력 >> ");
        String computer_name = scanner.nextLine();

        players[0] = new Human(human_name);
        players[1] = new Computer(computer_name);

        System.out.println("2명의 선수를 생성 완료하였습니다...");
        System.out.println();
    }

    private void draw() {
        System.out.println("비겼습니다.");
        System.out.println();
    }

    private void changePlayer() {
        System.out.println("오너가 " + losePlayer.getName() + "으로 변경되었습니다.");
        System.out.println();
        Player temp = winnerPlayer;
        winnerPlayer = losePlayer;
        losePlayer = temp;
    }

    private void printWinner() {
        System.out.println();
        System.out.println(winnerPlayer.getName() + "님이 이겼습니다.");
        System.out.println("게임을 종료합니다...");
    }

    public void run() {
        System.out.println("***** 묵찌빠 게임을 시작합니다. ******");
        createPlayer();

        while (true) {
            if (winnerPlayer == null) {
                players[0].next();
                players[1].next();
                System.out.println(players[0].getName() + " : " + players[0].getBet() + ", "
                        + players[1].getName() + " : " + players[1].getBet());
                if (players[0].getBet().equals("묵")) {
                    if (players[1].getBet().equals("찌")) {
                        System.out.println();
                        winnerPlayer = players[0];
                        losePlayer = players[1];
                    } else if (players[1].getBet().equals("빠")) {
                        System.out.println("오너가 " + players[1].getName() + "으로 변경되었습니다.");
                        System.out.println();
                        winnerPlayer = players[1];
                        losePlayer = players[0];
                    } else {
                        draw();
                    }
                } else if (players[0].getBet().equals("찌")) {
                    if (players[1].getBet().equals("빠")) {
                        System.out.println();
                        winnerPlayer = players[0];
                        losePlayer = players[1];
                    } else if (players[1].getBet().equals("묵")) {
                        System.out.println("오너가 " + players[1].getName() + "으로 변경되었습니다.");
                        System.out.println();
                        winnerPlayer = players[1];
                        losePlayer = players[0];
                    } else {
                        draw();
                    }
                } else if (players[0].getBet().equals("빠")) {
                    if (players[1].getBet().equals("묵")) {
                        System.out.println();
                        winnerPlayer = players[0];
                        losePlayer = players[1];
                    } else if (players[1].getBet().equals("찌")) {
                        System.out.println("오너가 " + players[1].getName() + "으로 변경되었습니다.");
                        System.out.println();
                        winnerPlayer = players[1];
                        losePlayer = players[0];
                    } else {
                        draw();
                    }
                }
            } else {
                winnerPlayer.next();
                losePlayer.next();
                System.out.println(winnerPlayer.getName() + " : " + winnerPlayer.getBet() + ", "
                        + losePlayer.getName() + " : " + losePlayer.getBet());
                if (winnerPlayer.getBet().equals("묵")) {
                    if (losePlayer.getBet().equals("찌")) {
                        System.out.println();
                    } else if (players[1].getBet().equals("빠")) {
                        changePlayer();
                    } else {
                        printWinner();
                        break;
                    }
                } else if (winnerPlayer.getBet().equals("찌")) {
                    if (losePlayer.getBet().equals("빠")) {
                        System.out.println();
                    } else if (losePlayer.getBet().equals("묵")) {
                        changePlayer();
                    } else {
                        printWinner();
                        break;
                    }
                } else if (winnerPlayer.getBet().equals("빠")) {
                    if (losePlayer.getBet().equals("묵")) {
                        System.out.println();
                    } else if (losePlayer.getBet().equals("찌")) {
                        changePlayer();
                    } else {
                        printWinner();
                        break;
                    }
                }
            }
        }
    }
}

public class Practice10 {
    public static void main(String[] args) {
        new Game().run();
    }
}