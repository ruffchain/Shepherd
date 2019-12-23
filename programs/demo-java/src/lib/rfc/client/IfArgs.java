package lib.rfc.client;

import org.json.JSONException;
import org.json.JSONObject;

public class IfArgs {
    public String method = "";
    public JSONObject params;

    public JSONObject toJSON() {
        try {
            JSONObject obj = new JSONObject();
            obj.put("method", this.method);
            obj.put("params", this.params);
            return obj;
        } catch (JSONException e) {
            System.out.println("Exception");
        }

        return null;
    }

    public String toString() {
        return this.toJSON().toString();
    }
}