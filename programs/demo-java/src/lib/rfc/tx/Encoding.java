package lib.rfc.tx;

import java.math.BigDecimal;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;

import org.json.JSONObject;

public class Encoding {
    public static final int MAX_DECIMAL_LEN = 9;
    public static final Charset encodingType = StandardCharsets.UTF_8;
    public static final String ONE_HASH = "0100000000000000000000000000000000000000000000000000000000000000";
    public static final String ZERO_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
    public static final String MAX_HASH = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    public static final String NULL_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
    public static final String HIGH_HASH = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    public static final String ZERO_KEY = "000000000000000000000000000000000000000000000000000000000000000000";
    public static final String ZERO_SIG64 = "0000000000000000000000000000000000000000000000000000000000000000"
            + "0000000000000000000000000000000000000000000000000000000000000000";

    public static String textToHex(String text) {
        byte[] buf = null;
        buf = text.getBytes(Encoding.encodingType);

        char[] HEX_CHARS = "0123456789abcdef".toCharArray();

        char[] chars = new char[2 * buf.length];

        for (int i = 0; i < buf.length; i++) {
            chars[2 * i] = HEX_CHARS[(buf[i] & 0xF0) >> 4];
            chars[2 * i + 1] = HEX_CHARS[buf[i] & 0x0F];
        }
        return new String(chars);
    }

    public static String hexToText(String hex) {
        int l = hex.length();
        byte[] data = new byte[l / 2];
        for (int i = 0; i < l; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4) + Character.digit(hex.charAt(i + 1), 16));
        }
        String st = new String(data, Encoding.encodingType);
        return st;
    }

    // public static void test() {
    // System.out.println("\ntest");
    // String text = "df";

    // byte[] byteArray = new byte[text.length() / 2];

    // for (int i = 0; i < byteArray.length; i++) {
    // System.out.println(":" + i);
    // byte hi = (byte) (Character.digit(text.charAt(i), 16) & 0xff);
    // byte lo = (byte) (Character.digit(text.charAt(i + 1), 16) & 0xff);
    // byteArray[i] = (byte) (hi << 4 | lo);
    // System.out.println(byteArray[i]);
    // }
    // for (int i = 0; i < byteArray.length; i++) {
    // System.out.println(Integer.toHexString(byteArray[i] & 0xff));
    // }

    // }
    public static int sizeVarint(int num) {
        if (num < 0xfd) {
            return 1;
        }

        if (num <= 0xffff) {
            return 3;
        }

        if (num <= 0xffffffff) {
            return 5;
        }

        return 9;
    }

    public static String toStringifiable(JSONObject input, boolean parsable) {
        try {

            Iterator keys = input.keys();

            StringBuffer sb = new StringBuffer("{");
            while (keys.hasNext()) {
                if (sb.length() > 1) {
                    sb.append(',');
                }
                Object o = keys.next();
                sb.append(JSONObject.quote(o.toString()));
                sb.append(':');

                Object o1 = input.get(o.toString());
                if (o1.getClass() == String.class) {
                    sb.append("\"");
                    sb.append("s" + o1);
                    sb.append("\"");
                } else if (o1.getClass() == BigDecimal.class) {
                    sb.append("n" + o1);
                } else if (o1.getClass() == Integer.class) {
                    sb.append(o1.toString());
                }

            }

            sb.append("}");
            return sb.toString();

        } catch (Exception e) {
            return null;
        }
    }
}