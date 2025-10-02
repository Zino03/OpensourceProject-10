import java.util.Scanner;

public class Practice13 {
    private Player[] players;
    private Scanner scanner;

    public Practice13() {
        scanner = new Scanner(System.in);
    }

    private void createPlayers() { // 게임참가자수를입력받고Player[]을생성하는메소드
        System.out.print("게임의 참가하는 인원은 몇 명 입니까? >> ");
        int n = scanner.nextInt();

        scanner.nextLine();

        players = new Player[n];

        for (int i = 0; i < n; i++) {
            System.out.print("참가자의 이름을 입력하세요. >> ");
            String name = scanner.next();
            players[i] = new Player(name);
        }
    }

    public Boolean checkSuccess(String lastWord, String newWord) { // lastWord와newWord를비교하는메소드
        int lastIndex = lastWord.length() - 1;
        char lastChar = lastWord.charAt(lastIndex);
        char FirstChar = newWord.charAt(0);
        System.out.println(lastChar + " " + FirstChar);
        if (lastChar == FirstChar)
            return true;
        else
            return false;
    }

    public void run() { // 게임을진행하는메소드
        System.out.println("끝말잇기 게임을 시작합니다...");
        createPlayers();

        String lastWord = "아버지";
        System.out.println("시작 단어는 " + lastWord + " 입니다.");

        int counter = 0;
        while (true) {
            Player currentPlayer = players[counter % players.length];
            String newWord = currentPlayer.getWordFromUser(scanner);

            if (checkSuccess(lastWord, newWord) == false) {
                System.out.println(currentPlayer.getName() + "이(가) 졌습니다.");
                break;
            }

            lastWord = newWord;
            counter++;
        }
        scanner.close();
    }

    public static void main(String[] args) { // 메인메소드
        Practice13 start = new Practice13();
        start.run();
    }
}

class Player {
    private String name;

    public Player(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getWordFromUser(Scanner scanner) { // 사용자로부터단어를입력받는메소드
        System.out.print(name + ">> ");
        return scanner.next();
    }
}