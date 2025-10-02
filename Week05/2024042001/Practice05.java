
public class practice05 {
    String title;
    String author;

    void show() {
        System.out.println(title + " " + author);
    }

    public practice05() {
        this("", "");
        System.out.println("생성자 호출됨");
    }

    public practice05(String title) {
        this(title, "작자미상");
    }

    public practice05(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public static void main(String[] args) {
        practice05 littlePrince = new practice05("어린왕자", "생텍쥐페리");
        practice05 loveStory = new practice05("춘향전");
        practice05 emptyBook = new practice05();

        loveStory.show();
    }
}
