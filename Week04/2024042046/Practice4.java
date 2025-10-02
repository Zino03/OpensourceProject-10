public class Practice4 { // Book
    String title;
    String author;
    public Practice4(String t) {
        title = t;
        author = "작자미상";
    }
    public Practice4(String t, String a) {
        title = t;
        author = a;
    }

    public static void main(String[] args) {
        Practice4 littlePrince = new Practice4("어린왕자", "생텍쥐페리");
        Practice4 loveStory = new Practice4("춘향전");
        System.out.println(littlePrince.title+" "+littlePrince.author);
        System.out.println(loveStory.title+" "+loveStory.author);
    }
}
