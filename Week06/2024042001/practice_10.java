import java.util.Scanner;
import java.util.Random;

abstract class Player {
    protected final String[] bet = {"묵", "찌", "빠"};
    protected String name;
    protected String lastBet = null;

    protected Player(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getLastBet() {
        return lastBet;
    }

    abstract public String next();
}

class Human extends Player {
    private final Scanner scanner;

    public Human(String name, Scanner scanner) {
        super(name);
        this.scanner = scanner;
    }

    @Override
    public String next() {
        while (true) {
            System.out.printf("%s님 차례입니다. 묵, 찌, 빠 중 하나를 입력하세요: ", name);
            String input = scanner.next().trim();

            boolean isValid = false;
            for (String validBet : bet) {
                if (validBet.equals(input)) {
                    isValid = true;
                    break;
                }
            }

            if (isValid) {
                this.lastBet = input;
                return input;
            } else {
                System.out.println("잘못된 입력입니다. '묵', '찌', '빠' 중 하나만 입력해주세요.");
            }
        }
    }
}

class Computer extends Player {
    private final Random random;

    public Computer(String name) {
        super(name);
        this.random = new Random();
    }

    @Override
    public String next() {
        int index = random.nextInt(bet.length);
        this.lastBet = bet[index];
        System.out.println("컴퓨터가 결정하였습니다.");
        return this.lastBet;
    }
}

class Game {
    private final Player[] players = new Player[2];
    private final Scanner scanner;
    private int ownerIndex = 0;

    public Game() {
        this.scanner = new Scanner(System.in);
    }

    private void createPlayer() {
        System.out.println("--- 묵찌빠 게임 시작 ---");
        System.out.print("당신의 이름을 입력하세요: ");
        String humanName = scanner.next();

        players[0] = new Human(humanName, scanner);
        players[1] = new Computer("컴퓨터");

        System.out.printf("환영합니다, %s님! 컴퓨터와 묵찌빠 게임을 시작합니다.\n", humanName);
    }

    private int determineRPSWinner(String p1Bet, String p2Bet) {
        if (p1Bet.equals(p2Bet)) {
            return 0;
        }

        if ((p1Bet.equals("묵") && p2Bet.equals("찌")) ||
                (p1Bet.equals("찌") && p2Bet.equals("빠")) ||
                (p1Bet.equals("빠") && p2Bet.equals("묵"))) {
            return 1;
        } else {
            return 2;
        }
    }

    public void run() {
        createPlayer();

        System.out.printf("초기 오너는 %s님입니다.\n", players[ownerIndex].getName());

        while (true) {
            Player human = players[0];
            Player computer = players[1];
            Player owner = players[ownerIndex];

            human.next();
            computer.next();

            String humanChoice = human.getLastBet();
            String computerChoice = computer.getLastBet();

            System.out.printf("%s: %s, %s: %s\n",
                    human.getName(), humanChoice,
                    computer.getName(), computerChoice);

            int winnerRPS = determineRPSWinner(humanChoice, computerChoice);

            if (winnerRPS == 0) {
                System.out.printf("\n*** %s님 승리! (선택 일치) ***\n", owner.getName());
                break;
            } else {
                int newOwnerIndex = (winnerRPS == 1) ? 0 : 1;

                if (newOwnerIndex != ownerIndex) {
                    ownerIndex = newOwnerIndex;
                    System.out.printf("묵찌빠! 오너가 %s님으로 변경됩니다. 게임 계속.\n", players[ownerIndex].getName());
                } else {
                    System.out.printf("묵찌빠! 오너가 유지됩니다: %s님. 게임 계속.\n", players[ownerIndex].getName());
                }
            }
        }
        scanner.close();
    }
}

public class practice_10 {
    public static void main(String[] args) {
        new Game().run();
    }
}