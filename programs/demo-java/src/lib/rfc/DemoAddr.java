package lib.rfc;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;

import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.AddressFormatException;

import java.security.SecureRandom;

public class DemoAddr {

    /**
     * address from secret key ,
     * 
     * @param secret 32 bytes hex format
     */
    public static String addressFromSecretKey(String secret) {

        BigInteger priv = new BigInteger(secret, 16);

        ECKey key = ECKey.fromPrivate(priv);
        NetworkParameters params = new MainNetParams();
        Address addr = key.toAddress(params);

        return addr + "";
    }

    /**
     * get public address from secret key
     * 
     * @param secret hex string format of secret
     * 
     * @return hex string format of public key
     */
    public static String publicKeyFromSecretKey(String secret) {

        BigInteger priv = new BigInteger(secret, 16);

        ECKey key = ECKey.fromPrivate(priv);

        String pub = key.getPublicKeyAsHex();

        return pub;
    }

    public static String createKey() {

        try {
            SecureRandom secureRandom = SecureRandom.getInstanceStrong();
            ECKey key = new ECKey(secureRandom);

            BigInteger pvt = key.getPrivKey();

            String strKey = adjustTo64(pvt.toString(16));

            return strKey;

        } catch (NoSuchAlgorithmException e) {
            System.err.println("createKey():" + e);
            return null;
        }
    }

    static private String adjustTo64(final String s) {
        switch (s.length()) {
        case 62:
            return "00" + s;
        case 63:
            return "0" + s;
        case 64:
            return s;
        default:
            throw new IllegalArgumentException("not a valid key: " + s);
        }
    }

    /**
     * check address valid or not
     */
    public static boolean isValidAddress(final String str) {
        NetworkParameters params = new MainNetParams();

        try {
            Address addr = Address.fromBase58(params, str);

        } catch (AddressFormatException e) {
            System.err.println("Wrong addr");
            return false;
        }

        return true;
    }

    public static boolean isValidAmount(final String str) {
        try {
            BigDecimal num = new BigDecimal(str);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static boolean isValidAmount(final BigDecimal dec) {
        try {
            BigDecimal num = dec;
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public static boolean isValidFee(final String str) {
        try {
            double num = Double.parseDouble(str);
            return num >= 0.1;
        } catch (NumberFormatException e) {
            return false;
        }

    }

    public static boolean isValidFee(final int innum) {
        try {
            int num = innum;
            return num >= 0.1;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isValidFee(final BigDecimal innum) {
        try {
            double num = innum.doubleValue();
            return (num >= 0.1);
        } catch (NumberFormatException e) {
            return false;
        }
    }
}