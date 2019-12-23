package lib.rfc.tx;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.util.Vector;

class WriteOp {
    public final static byte SEEK = 0;
    public final static byte UI8 = 1;
    public final static byte UI16 = 2;
    public final static byte UI16BE = 3;
    public final static byte UI32 = 4;
    public final static byte UI32BE = 5;
    public final static byte UI64 = 6;
    public final static byte UI64BE = 7;
    public final static byte I8 = 10;
    public final static byte I16 = 11;
    public final static byte I16BE = 12;
    public final static byte I32 = 13;
    public final static byte I32BE = 14;
    public final static byte I64 = 15;
    public final static byte I64BE = 16;
    public final static byte FL = 19;
    public final static byte FLBE = 20;
    public final static byte DBL = 21;
    public final static byte DBLBE = 22;
    public final static byte VARINT = 23;
    public final static byte VARINT2 = 25;
    public final static byte BYTES = 27;
    public final static byte STR = 28;
    public final static byte CHECKSUM = 29;
    public final static byte FILL = 30;

    public byte type;
    public int enc;
    public int size;

    public WriteOp(byte type, int enc, int size) {
        this.type = type;
        this.enc = enc;
        this.size = size;
    }
}

class WriteOpInt extends WriteOp {
    public int value;

    public WriteOpInt(byte type, int val, int enc, int size) {
        super(type, enc, size);
        value = val;
    }
}

class WriteOpLong extends WriteOp {
    public long value;

    public WriteOpLong(byte type, long val, int enc, int size) {
        super(type, enc, size);
        value = val;
    }
}

class WriteOpFloat extends WriteOp {
    public Float value;

    public WriteOpFloat(byte type, Float val, int enc, int size) {
        super(type, enc, size);
        value = val;
    }
}

class WriteOpDouble extends WriteOp {
    public Double value;

    public WriteOpDouble(byte type, Double val, int enc, int size) {
        super(type, enc, size);
        value = val;
    }
}

class WriteOpBytes extends WriteOp {
    public byte[] value;

    public WriteOpBytes(byte type, byte[] val, int enc, int size) {
        super(type, enc, size);
        value = new byte[val.length];
        for (int i = 0; i < val.length; i++) {
            value[i] = val[i];
        }
    }
}

public class BufferWriter {

    private Vector<WriteOp> ops;
    private int offset;

    public BufferWriter() {
        ops = new Vector<WriteOp>();
        offset = 0;
    }

    public int getSize() {
        return offset;
    }

    public void seek(int mOffset) {
        offset += mOffset;
        ops.add(new WriteOpInt(WriteOp.SEEK, mOffset, 0, 0));
    }

    public void destroy() {
        ops.clear();
        offset = 0;
    }

    public byte[] render() {
        byte[] data = new byte[offset];
        int off = 0;
        int mInt = 0;
        long mLong = 0;
        float mFloat = 0;
        double mDouble = 0;
        byte[] mByte;

        for (int i = 0; i < ops.size(); i++) {
            WriteOp op = ops.get(i);

            switch (op.type) {
            case WriteOp.SEEK:
                off += ((WriteOpInt) op).value;
                break;
            case WriteOp.UI8:
                // off = data.writeUInt8(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.UI16:
                // off = data.writeUInt16LE(op.value, off, true);

                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) (mInt & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                break;
            case WriteOp.UI16BE:
                // off = data.writeUInt16BE(op.value, off, true);

                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.UI32:

                // off = data.writeUInt32LE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;

                data[off++] = (byte) (mInt & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) ((mInt >> 16) & 0xFF);
                data[off++] = (byte) ((mInt >> 24) & 0xFF);

                break;
            case WriteOp.UI32BE:
                // off = data.writeUInt32BE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) ((mInt >> 24) & 0xFF);
                data[off++] = (byte) ((mInt >> 16) & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.UI64:
                // off = Encoding.writeU64(data, op.value, off);
                mLong = ((WriteOpLong) op).value;
                data[off++] = (byte) (mLong & 0xFF);
                data[off++] = (byte) ((mLong >> 8) & 0xFF);
                data[off++] = (byte) ((mLong >> 16) & 0xFF);
                data[off++] = (byte) ((mLong >> 24) & 0xFF);
                data[off++] = (byte) ((mLong >> 32) & 0xFF);
                data[off++] = (byte) ((mLong >> 40) & 0xFF);
                data[off++] = (byte) ((mLong >> 48) & 0xFF);
                data[off++] = (byte) ((mLong >> 56) & 0xFF);

                break;
            case WriteOp.UI64BE:
                // off = Encoding.writeU64BE(data, op.value, off);
                mLong = ((WriteOpLong) op).value;

                data[off++] = (byte) ((mLong >> 56) & 0xFF);
                data[off++] = (byte) ((mLong >> 48) & 0xFF);
                data[off++] = (byte) ((mLong >> 40) & 0xFF);
                data[off++] = (byte) ((mLong >> 32) & 0xFF);
                data[off++] = (byte) ((mLong >> 24) & 0xFF);
                data[off++] = (byte) ((mLong >> 16) & 0xFF);
                data[off++] = (byte) ((mLong >> 8) & 0xFF);
                data[off++] = (byte) (mLong & 0xFF);

                break;
            case WriteOp.I8:
                // off = data.writeInt8(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.I16:
                // off = data.writeInt16LE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) (mInt & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                break;
            case WriteOp.I16BE:
                // off = data.writeInt16BE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.I32:
                // off = data.writeInt32LE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;

                data[off++] = (byte) (mInt & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) ((mInt >> 16) & 0xFF);
                data[off++] = (byte) ((mInt >> 24) & 0xFF);
                break;
            case WriteOp.I32BE:
                // off = data.writeInt32BE(op.value, off, true);
                mInt = ((WriteOpInt) op).value;
                data[off++] = (byte) ((mInt >> 24) & 0xFF);
                data[off++] = (byte) ((mInt >> 16) & 0xFF);
                data[off++] = (byte) ((mInt >> 8) & 0xFF);
                data[off++] = (byte) (mInt & 0xFF);
                break;
            case WriteOp.I64:
                // off = Encoding.writeI64(data, op.value, off);
                mLong = ((WriteOpLong) op).value;
                data[off++] = (byte) (mLong & 0xFF);
                data[off++] = (byte) ((mLong >> 8) & 0xFF);
                data[off++] = (byte) ((mLong >> 16) & 0xFF);
                data[off++] = (byte) ((mLong >> 24) & 0xFF);
                data[off++] = (byte) ((mLong >> 32) & 0xFF);
                data[off++] = (byte) ((mLong >> 40) & 0xFF);
                data[off++] = (byte) ((mLong >> 48) & 0xFF);
                data[off++] = (byte) ((mLong >> 56) & 0xFF);
                break;
            case WriteOp.I64BE:
                // off = Encoding.writeI64BE(data, op.value, off);
                mLong = ((WriteOpLong) op).value;

                data[off++] = (byte) ((mLong >> 56) & 0xFF);
                data[off++] = (byte) ((mLong >> 48) & 0xFF);
                data[off++] = (byte) ((mLong >> 40) & 0xFF);
                data[off++] = (byte) ((mLong >> 32) & 0xFF);
                data[off++] = (byte) ((mLong >> 24) & 0xFF);
                data[off++] = (byte) ((mLong >> 16) & 0xFF);
                data[off++] = (byte) ((mLong >> 8) & 0xFF);
                data[off++] = (byte) (mLong & 0xFF);
                break;
            case WriteOp.FL:
                // off = data.writeFloatLE(op.value, off, true);
                mFloat = ((WriteOpFloat) op).value;
                ByteBuffer buf = ByteBuffer.allocate(4);
                buf.putFloat(mFloat);
                byte[] mbuf = new byte[4];
                buf.get(mbuf);
                data[off++] = mbuf[3];
                data[off++] = mbuf[2];
                data[off++] = mbuf[1];
                data[off++] = mbuf[0];

                break;
            case WriteOp.FLBE:
                // off = data.writeFloatBE(op.value, off, true);
                mFloat = ((WriteOpFloat) op).value;
                buf = ByteBuffer.allocate(4);
                buf.putFloat(mFloat);
                mbuf = new byte[4];
                buf.get(mbuf);
                data[off++] = mbuf[0];
                data[off++] = mbuf[1];
                data[off++] = mbuf[2];
                data[off++] = mbuf[3];
                break;
            case WriteOp.DBL:
                // off = data.writeDoubleLE(op.value, off, true);
                mDouble = ((WriteOpDouble) op).value;
                buf = ByteBuffer.allocate(8);
                buf.putDouble(mDouble);
                mbuf = new byte[8];
                buf.get(mbuf);
                data[off++] = mbuf[7];
                data[off++] = mbuf[6];
                data[off++] = mbuf[5];
                data[off++] = mbuf[4];
                data[off++] = mbuf[3];
                data[off++] = mbuf[2];
                data[off++] = mbuf[1];
                data[off++] = mbuf[0];
                break;
            case WriteOp.DBLBE:
                // off = data.writeDoubleBE(op.value, off, true);
                mDouble = ((WriteOpDouble) op).value;
                buf = ByteBuffer.allocate(8);
                buf.putDouble(mDouble);
                mbuf = new byte[8];
                buf.get(mbuf);
                data[off++] = mbuf[0];
                data[off++] = mbuf[1];
                data[off++] = mbuf[2];
                data[off++] = mbuf[3];
                data[off++] = mbuf[4];
                data[off++] = mbuf[5];
                data[off++] = mbuf[6];
                data[off++] = mbuf[7];
                break;
            case WriteOp.VARINT:
                // off = Encoding.writeVarint(data, op.value, off);
                // break;
                // case WriteOp.VARINT2:
                // // off = Encoding.writeVarint2(data, op.value, off);
                mInt = ((WriteOpInt) op).value;
                if (mInt < 0xfd) {
                    data[off++] = (byte) (mInt & 0xff);

                } else if (mInt <= 0xffff) {
                    data[off++] = (byte) (0xfd);
                    data[off++] = (byte) (mInt & 0xff);
                    data[off++] = (byte) ((mInt >> 8) & 0xff);

                } else if (mInt <= 0xffffffff) {
                    data[off++] = (byte) 0xfe;
                    data[off++] = (byte) (mInt & 0xff);
                    data[off++] = (byte) ((mInt >> 8) & 0xff);
                    data[off++] = (byte) ((mInt >> 16) & 0xff);
                    data[off++] = (byte) (mInt >> 24);
                } else {
                    // We dont have number that big
                    System.exit(-1);
                }
                break;
            case WriteOp.STR:
            case WriteOp.BYTES:
                // off += op.value.copy(data, off);
                mByte = ((WriteOpBytes) op).value;
                for (int ii = 0; ii < mByte.length; ii++) {
                    data[off++] = mByte[ii];
                }
                break;
            // case WriteOp.STR:
            // // off += data.write(op.value, off, op.enc);
            // break;
            case WriteOp.CHECKSUM:
                // off += digest.hash256(data.slice(0, off)).copy(data, off, 0, 4);
                // compute sha256, 256bit, 32byte!
                mByte = Digest.hash256(data, off);
                for (i = 0; i < mByte.length; i++) {
                    data[off++] = mByte[i];
                }

                break;
            case WriteOp.FILL:
                // data.fill(op.value, off, off + op.size);
                // off += op.size;
                mByte = ((WriteOpBytes) op).value;
                for (int ii = 0; ii < mByte.length; ii++) {
                    data[off++] = mByte[ii];
                }
                break;
            default:
                assert (false);
                break;
            }
        }

        assert (off == data.length);

        destroy();

        return data;
    }

    private void writeU8(int value) {
        offset += 1;
        ops.add(new WriteOpInt(WriteOp.UI8, value, 0, 0));
    }

    private void writeU16(int value) {
        offset += 2;
        ops.add(new WriteOpInt(WriteOp.UI16, value, 0, 0));
    }

    private void writeU16BE(int value) {
        offset += 2;
        ops.add(new WriteOpInt(WriteOp.UI16BE, value, 0, 0));

    }

    public void writeU32(int value) {
        offset += 4;
        ops.add(new WriteOpInt(WriteOp.UI32, value, 0, 0));
    }

    private void writeU32BE(int value) {
        offset += 4;
        ops.add(new WriteOpInt(WriteOp.UI32BE, value, 0, 0));

    }

    private void writeU64(long value) {
        offset += 8;
        ops.add(new WriteOpLong(WriteOp.UI64, value, 0, 0));

    }

    private void writeU64BE(long value) {
        offset += 8;
        ops.add(new WriteOpLong(WriteOp.UI64BE, value, 0, 0));

    }

    private void writeI8(int value) {
        this.offset += 1;
        ops.add(new WriteOpInt(WriteOp.I8, value, 0, 0));
    }

    private void writeI16(int value) {
        this.offset += 2;
        ops.add(new WriteOpInt(WriteOp.I16, value, 0, 0));
    }

    private void writeI16BE(int value) {
        this.offset += 2;
        ops.add(new WriteOpInt(WriteOp.I16BE, value, 0, 0));
    }

    private void writeI32(int value) {
        this.offset += 4;
        ops.add(new WriteOpInt(WriteOp.I32, value, 0, 0));
    }

    private void writeI32BE(int value) {
        this.offset += 4;
        ops.add(new WriteOpInt(WriteOp.I32BE, value, 0, 0));
    }

    private void writeI64(int value) {
        this.offset += 8;
        ops.add(new WriteOpInt(WriteOp.I64, value, 0, 0));
    }

    private void writeI64BE(int value) {
        this.offset += 8;
        ops.add(new WriteOpInt(WriteOp.I64BE, value, 0, 0));
    }

    private void writeFloat(Float value) {
        this.offset += 4;
        ops.add(new WriteOpFloat(WriteOp.FL, value, 0, 0));
    }

    private void writeFloatBE(Float value) {
        this.offset += 4;
        ops.add(new WriteOpFloat(WriteOp.FLBE, value, 0, 0));
    }

    private void writeOpDouble(Double value) {
        this.offset += 4;
        ops.add(new WriteOpDouble(WriteOp.DBL, value, 0, 0));
    }

    private void writeOpDoubleBE(Double value) {
        this.offset += 4;
        ops.add(new WriteOpDouble(WriteOp.DBLBE, value, 0, 0));
    }

    // private void WriteVariant(int value) {
    // this.offset += 4;
    // ops.add(new WriteOpDouble(WriteOp.DBL, value, 0, 0));
    // }
    public void writeBytes(byte[] value) {
        if (value.length == 0) {
            return;
        }
        offset += value.length;
        ops.add(new WriteOpBytes(WriteOp.BYTES, value, 0, 0));
    }

    public void writeBigNumber(BigDecimal val) {
        val = val.setScale(Encoding.MAX_DECIMAL_LEN, BigDecimal.ROUND_HALF_UP);
        String str = val.stripTrailingZeros().toPlainString();

        this.writeVarString(str);
    }

    private void copy(byte[] value, int start, int end) {
        assert (end >= start);
        byte[] bytes = new byte[end - start];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = value[start + i];
        }
        writeBytes(bytes);
    }

    private void writeString(String value) {
        byte[] bytes = value.getBytes();
        writeBytes(bytes);
    }

    public void writeVarString(String value) {
        if (value.length() == 0) {
            this.offset += Encoding.sizeVarint(0);
            this.ops.add(new WriteOpInt(WriteOp.VARINT, 0, 0, 0));
        }
        int size = value.length();
        this.offset += Encoding.sizeVarint(size);
        this.offset += size;

        this.ops.add(new WriteOpInt(WriteOp.VARINT, size, 0, 0));
        this.ops.add(new WriteOpBytes(WriteOp.STR, value.getBytes(), 0, 0));
    }

    private void writeNullString(String value) {
        writeString(value);
        writeU8(0);
    }

    private void writeChecksum() {
        offset += 32;
        ops.add(new WriteOpInt(WriteOp.CHECKSUM, 0, 0, 0));
    }

    private void fill(int value, int size) {
        assert (size >= 0);

        if (size == 0) {
            return;
        }
        offset += size;
        byte[] bytes = new byte[size];
        for (int i = 0; i < size; i++) {
            bytes[i] = (byte) (value & 0xff);
        }
        writeBytes(bytes);
    }

}