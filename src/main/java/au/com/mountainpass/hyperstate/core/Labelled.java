package au.com.mountainpass.hyperstate.core;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.jdt.annotation.Nullable;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import au.com.mountainpass.hyperstate.server.serialization.MessageSourceAwareSerializer;

abstract public class Labelled {

    private Set<String> natures = new HashSet<>();

    @Nullable
    String label = null;

    public Labelled() {
    }

    public Labelled(Labelled labelled) {
        this();
        this.label = labelled.label;
        this.natures = labelled.natures;
    }

    void setLabel(String template, String... args) {
        label = interpolate(template, args);
    }

    private String interpolate(String value, String... args) {
        if (args.length == 0) {
            return value;
        } else {
            Pattern patt = Pattern.compile("\\{(.*?)\\}");
            Matcher m = patt.matcher(value);
            StringBuffer sb = new StringBuffer(value.length());
            for (int i = 0; m.find(); ++i) {
                String code = m.group(1);
                m.appendReplacement(sb, Matcher.quoteReplacement(args[i]));
            }
            m.appendTail(sb);
            return sb.toString();
        }
    }

    public Labelled(String label, Set<String> natures) {
        this.label = label;
        this.natures = natures;
    }

    public Labelled(String label, String... natures) {
        this.label = label;
        this.natures.addAll(Arrays.asList(natures));
    }

    /**
     * @return the natures
     */
    @JsonProperty("class")
    public Set<String> getNatures() {
        return natures;
    }

    /**
     * @param natures
     *            the natures to set
     */
    @JsonProperty("class")
    public void setNatures(Set<String> natures) {
        this.natures = natures;
    }

    /**
     * @return the label
     */
    @JsonSerialize(using = MessageSourceAwareSerializer.class)
    @JsonProperty("title")
    public String getLabel() {
        return label;
    }

    /**
     * @param title
     *            the label to set
     */
    public void setTitle(String title) {
        this.label = title;
    }

    public boolean hasNature(String nature) {
        return this.getNatures().contains(nature);
    }

}
