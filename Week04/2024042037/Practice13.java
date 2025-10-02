import java.util.Scanner;

public class Practice13 {  // WordGameApp
    static Scanner sc = new Scanner(System.in);
    private int n;
    private Player[] player;

    public Practice13() {}
    private void createPlayers() {
        player = new Player[n];
        for (int i = 0; i < n; i++) {
            player[i] = new Player();
            System.out.print("참가자의 이름을 입력하세요>>");
            player[i].name = sc.next();
        }
    }
    public Boolean checkSuccess(String lastWord, String newWord) {
        int lastIndex = lastWord.length() - 1;
        char lastChar = lastWord.charAt(lastIndex);
        char firstChar = newWord.charAt(0);

        if (lastChar == firstChar) {
            return true;
        } else {
            return false;
        }
    }
    public void run() {
        System.out.println("끝말잇기 게임을 시작합니다....");
        System.out.print("게임에 참가하는 인원은 몇명입니까>>");
        n = sc.nextInt();

        createPlayers();

        int i = 0;
        String lastWord = "아버지";
        String newWord;
        System.out.println("시작하는 단어는 " + lastWord + "입니다.");
        while (true) {
            newWord = player[i].getWordFromUser();
            if (!checkSuccess(lastWord, newWord)) {
                System.out.println(player[i].name + "이 졌습니다.");
                break;
            }

            lastWord = newWord;
            i = (i + 1) % n;
        }
        sc.close();
    }
    public static void main(String[] args) {
        Practice13 game = new Practice13();
        game.run();
    }
}

class Player {
    public String name;

    public String getWordFromUser() {
        System.out.print(name + ">>");
        return Practice13.sc.next();
    }
}
