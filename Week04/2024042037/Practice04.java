public class Practice04 {   // Book
    String title;
    String author;

    public Practice04(String t) {
        title = t;
        author = "작자미상";
    }

    public Practice04(String t, String a) {
        title = t;
        author = a;
    }

    public static void main(String [] args) {
        Practice04 littlePrince = new Practice04("어린왕자", "생텍쥐페리");
        Practice04 loveStory = new Practice04("춘향전");
        System.out.println(littlePrince.title + " " + littlePrince.author);
        System.out.println(loveStory.title + " " + loveStory.author);
    }
}
