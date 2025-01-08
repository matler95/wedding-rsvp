import random
import string

def generate_random_codes(num_codes, code_length):
    codes = []
    for _ in range(num_codes):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=code_length))
        codes.append(code)
    return codes

# Parameters
num_codes = 26  # Number of codes
code_length = 10  # Length of each code

# Generate codes
random_codes = generate_random_codes(num_codes, code_length)

# Display the codes
for idx, code in enumerate(random_codes, start=1):
    print(f"Code {idx}: {code}")
