public class Practice03 {
    int radius;
    String name;

    public Practice03() {
        radius = 1;
        name = "";
    }

    public Practice03(int r, String n) {
        radius = r;
        name = n;
    }

    public double getArea() {
        return 3.14 * radius * radius;
    }

    public static void main(String[] args) {
        Practice03 pizza = new Practice03(10, "자바피자");
        double area = pizza.getArea();
        System.out.println(pizza.name + "의면적은" + area);
        Practice03 donut = new Practice03();
        donut.name = "도넛피자";
        area = donut.getArea();
        System.out.println(donut.name + "의면적은" + area);
    }
}
