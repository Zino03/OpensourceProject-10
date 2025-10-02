
public class practice04{
    String title;
    String author;

    public practice04(String t) {
        title = t;
        author = "작자미상";
    }

    public practice04(String t, String a) {
        title = t;
        author = a;
    }

    public static void main(String[] args) {
        practice04 littlePrince = new practice04("어린왕자", "생텍쥐페리");
        practice04 loveStory = new practice04("춘향전");

        System.out.println(littlePrince.title + " " + littlePrince.author);
        System.out.println(loveStory.title + " " + loveStory.author);
    }
}
