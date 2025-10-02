public class Practice5 { // Book
    String title;
    String author;
    void show() {
        System.out.println(title+" "+author);
    }
    public Practice5() {
        this("","");
        System.out.println("생성자 호출됨");
    }
    public Practice5(String t) {
        this(t,"작자미상");
    }
    public Practice5(String t, String a) {
        this.title = t;
        this.author = a;
    }

    public static void main(String[] args) {
        Practice5 littlePrince = new Practice5("어린왕자", "생텍쥐페리");
        Practice5 loveStory = new Practice5("춘향전");
        Practice5 emptyBook = new Practice5();
        loveStory.show();
    }
}
