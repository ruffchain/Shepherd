package lib.rfc.tx;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import org.bitcoin.NativeSecp256k1;
import org.bitcoin.NativeSecp256k1Util;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.Sha256Hash;
import org.bitcoinj.core.ECKey.ECDSASignature;
import org.json.JSONObject;
import org.spongycastle.asn1.ASN1Integer;
import org.spongycastle.crypto.digests.RIPEMD160Digest;

public class Digest {
    public static byte[] hash256(byte[] inBytes, int offset) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = Arrays.copyOf(inBytes, offset);
            byte[] encodedhash = digest.digest(bytes);
            return digest.digest(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            return null;
        }

    }

    public static byte[] RIPEMD160(byte[] input) {
        RIPEMD160Digest d = new RIPEMD160Digest();

        d.update(input, 0, input.length);

        byte[] o = new byte[d.getDigestSize()];

        d.doFinal(o, 0);

        return o;
    }

    public static byte[] textToBytes(String text) {

        // System.out.println("length:" + text.length());

        if (text.length() % 2 != 0) {
            text = "0" + text;
        }
        byte[] bufOut = new byte[text.length() / 2];
        for (int i = 0; i < bufOut.length; i++) {
            // System.out.println(":" + i);
            byte hi = (byte) (Character.digit(text.charAt(i * 2), 16) & 0xff);
            byte lo = (byte) (Character.digit(text.charAt(i * 2 + 1), 16) & 0xff);

            bufOut[i] = (byte) (hi << 4 | lo);

            // System.out.println("------------");
        }

        return bufOut;
    }

    public static String bytesToText(byte[] buf) {
        String str = "";

        for (int i = 0; i < buf.length; i++) {
            // System.out.println(i + ":");
            // System.out.println(buf[i]);
            String strByte = Integer.toHexString(buf[i] & 0xff);
            if (strByte.length() < 2) {
                strByte = "0" + strByte;
            }
            str += strByte;
        }
        // if (str.length() % 2 != 0) {
        // str = "0" + str;
        // }
        return str;
    }

    public static int[] bytesToInts(byte[] buf) {
        int[] ints = new int[buf.length];
        for (int i = 0; i < buf.length; i++) {
            ints[i] = buf[i] < 0 ? ((int) buf[i] + 256) : (int) buf[i];
        }
        return ints;
    }

    public static boolean verify() {

        return false;
    }

    public static byte[] sign(String hash, String secret) {
        BigInteger priv = new BigInteger(secret, 16);
        ECKey secretKey = ECKey.fromPrivate(priv);
        Sha256Hash shahash = Sha256Hash.wrap(hash);
        ECDSASignature signature = secretKey.sign(shahash);

        System.out.println(signature.r.toString(16));
        System.out.println(signature.s.toString(16));

        byte[] sign = textToBytes(signature.r.toString(16) + signature.s.toString(16));

        return sign;
    }

    public static byte[] sign1(String hash, String secret) {

        // hash, secret must be 32 bytes
        byte[] byteHash = textToBytes(hash);
        byte[] byteSecret = textToBytes(secret);
        byte[] sign;
        try {
            sign = NativeSecp256k1.sign(byteHash, byteSecret);
        } catch (NativeSecp256k1Util.AssertFailException e) {
            System.err.println("sign err");
            return null;
        }

        return sign;
    }
}