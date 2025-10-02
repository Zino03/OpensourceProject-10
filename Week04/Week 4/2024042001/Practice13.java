import java.util.Scanner;

public class Practice13 { // WordGameApp
    private Player[] players;
    private int playerCount;
    private Scanner scanner = new Scanner(System.in);

    public Practice13() {
        // 게임 시작 안내 코드
        System.out.println("끝말잇기 게임을 시작합니다..");
        System.out.print("게임에 참가하는 인원은 몇명입니까>>");
        playerCount = scanner.nextInt();
        scanner.nextLine(); // 버퍼 처리
        players = new Player[playerCount];

        // 참가자 리스트 입력 및 player 객체 생성
        for (int i = 0; i < playerCount; i++) {
            System.out.print("참가자의 이름을 입력하세요>>");
            String name = scanner.nextLine();
            players[i] = new Player(name, scanner);
        }
    }

    // 끝말잇기 성공 여부 확인
    private boolean checkSuccess(String lastWord, String newWord) {
        char lastChar = lastWord.charAt(lastWord.length() - 1); // 이전 단어 마지막 글자
        char firstChar = newWord.charAt(0); // 새 단어 첫 글자
        return lastChar == firstChar;
    }

    // 게임 진행
    public void run() {
        String word = "아버지"; // 시작 단어
        System.out.println("시작하는 단어는 " + word + " 입니다");
        int turn = 0;
        while (true) {
            Player currentPlayer = players[turn % playerCount]; // 현재 차례 플레이
            String newWord = currentPlayer.getWordFromUser(); // 사용자 입력 단어
            // 끝말잇기 실패 시 게임 종료
            if (!checkSuccess(word, newWord)) {
                System.out.println(currentPlayer.getName() + "이 졌습니다.");
                break;
            }
            word = newWord; // 단어 갱신
            turn++;
        }
    }

    public static void main(String[] args) {
        Practice13 game = new Practice13();
        game.run();
    }
}

class Player {
    private String name;
    private Scanner scanner;

    public Player(String name, Scanner scanner) {
        this.name = name;
        this.scanner = scanner;
    }

    // 사용자로부터 단어 입력받기
    public String getWordFromUser() {
        System.out.print(name + ">>");
        return scanner.nextLine();
    }

    public String getName() {
        return name;
    }
}
