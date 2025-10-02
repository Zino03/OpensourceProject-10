public class Practice3 { // Circle
    int radius;
    String name;
    public Practice3() {
        radius = 1;
        name = "";
    }
    public Practice3(int r, String n) {
        radius = r;
        name = n;
    }
    public double getArea() {
        return 3.14*radius*radius;
    }

    public static void main(String[] args) {
        Practice3 pizza = new Practice3(10, "자바피자");
        double area = pizza.getArea();
        System.out.println(pizza.name+"의 면적은 "+area);
        Practice3 donut = new Practice3();
        donut.name = "도넛피자";
        area = donut.getArea();
        System.out.println(donut.name+"의 면적은 "+area);
    }
}
