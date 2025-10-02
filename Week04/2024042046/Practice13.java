import java.util.Scanner;

class Player {
    String name;
    public Player(String name) {
        this.name = name;
    }
    public String getWordFromUser() {
        Scanner scanner = new Scanner(System.in);
        System.out.print(name+">> ");
        return scanner.nextLine();
    }
}

public class Practice13 { // WorldGameApp
    public Practice13() {}

    private static Player[] createPlayers() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("끝말잇기 게임을 시작합니다...");
        System.out.print("게임에 참가하는 인원은 몇명입니까>> ");
        int n = scanner.nextInt();
        Player[] players = new Player[n];
        for(int i=0; i<n; i++) {
            System.out.print("참가자의 이름을 입력하세요>> ");
            String name = scanner.next();
            players[i] = new Player(name);
        }
        return players;
    }

    public static boolean checkSuccesss(String prevWord, String curWord) {
        int lastIndex = prevWord.length() - 1;
        char lastChar = prevWord.charAt(lastIndex);
        char firstChar = curWord.charAt(0);
        return lastChar != firstChar;
    }

    public static void run() {
        Player[] players = createPlayers();
        int i = 0;
        String prevWord = "아버지";
        System.out.println("시작하는 단어는 "+prevWord+"입니다.");
        while(true) {
            String word = players[i].getWordFromUser();
            if(checkSuccesss(prevWord, word)) {
                System.out.println(players[i].name+"이 졌습니다.");
                break;
            }
            prevWord = word;

            i = (i+1)%3;
        }
    }

    public static void main(String[] args) {
        run();
    }
}
