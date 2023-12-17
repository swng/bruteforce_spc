Raw data files not included, they are large...

# Process:

 - Generate initial spin files with commands such as:

- `java -jar sfinder.jar spin -p "*p7" -fb 0 -ft 4 -m 6 -c 1 -o "output/t_spc_spin_26.html" -t "v115@HhwwIexwHewwSeAgH"`

- Place them in `/spin_files/`.

- `spin_to_fumen.js` is designed to read in the html files and grab relevant fumens (non mini TSS).  
It should generate a large text file `output.txt` with a relevant spin fumen on each line.  
When satisfied, rename the generated `output.txt` to `step_a.txt`

- `parity_check.js` is designed to read `step_a.txt` and filter for good parity and output to `step_b.txt`. This may or may not be a useful filter.

- `divider_check.js` is designed to read `step_b.txt` and filter out 0% 6L fields via divider rule, and output to `step_b_2.txt`. This is a useful filter.

- `missing_pieces.js` is designed to read `step_b_2.txt` and process the missing pieces, outputting to `step_c.txt`.  
  This uses the fumens' queue comments, and assumes the setup queue was `*p7`.  
  If the `spin` command was run with a different setup queue, you may want to adjust this function.

- `process_congruents` reads the fumens from `step_c.txt` and processes congruents + mirror congruents, and outputs to `step_c_2.txt`  
  This uses a dictionary to track for duplicates. If the file is too large, there may be memory issues.

- `pc_chance_filter` reads from `step_c_2.txt` and makes sfinder calls and filters for 98%+ fields.  
  This may take a long time to finish. If you want to do this in batches, you can adjust start position on line 51.

- next steps: Convert to 7ps via recursive placement script; filter resultant 7ps for percent again; run score on final set.

# Dependencies

tetris-fumen, readline, htmlparser2

I think
  
