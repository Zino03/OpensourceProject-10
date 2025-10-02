public class Practice05 {   // Book
    String title;
    String author;
    void show() {
        System.out.println(title + " " + author);
    }
    public Practice05() {
        this("", "");
        System.out.println("생성자 호출됨");
    }
    public Practice05(String title) {
        this(title, "");
    }
    public Practice05(String title, String author) {
        this.title = title;
        this.author = author;
    }
    public static void main(String[] args) {
        Practice05 littlePrince = new Practice05("어린왕자", "생텍쥐페리");
        Practice05 loveStory = new Practice05("춘향전");
        Practice05 emptyBook = new Practice05();
        loveStory.show();
    }
}
